if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/bhawanashanker/.gradle/caches/9.3.1/transforms/ea2257517ccb8f841010d0cbbf51f1f1/transformed/hermes-android-250829098.0.10-debug/prefab/modules/hermesvm/libs/android.x86_64/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/bhawanashanker/.gradle/caches/9.3.1/transforms/ea2257517ccb8f841010d0cbbf51f1f1/transformed/hermes-android-250829098.0.10-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

