if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/bhawanashanker/.gradle/caches/9.3.1/transforms/220d65392139fe00f2cec43032d9c0c5/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.x86_64/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/bhawanashanker/.gradle/caches/9.3.1/transforms/220d65392139fe00f2cec43032d9c0c5/transformed/fbjni-0.7.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

